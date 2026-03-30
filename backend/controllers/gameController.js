const axios = require("axios");
const Game = require("../models/Game");
const User = require("../models/User");
const LeaderboardEntry = require("../models/LeaderboardEntry");
const PRODUCTS = require("../data/products");
const SELLERS = require("../data/sellers");

// UPDATED FOR GROQ (llama)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Build the AI seller's system prompt
const buildSystemPrompt = (seller, product, currentRound, maxRounds) => {
  return `You are ${seller.name} from ${seller.origin}, working as a seller at the legendary underground BLACK MARKET.

CHARACTER & PERSONALITY:
${seller.personality}

NEGOTIATION CONTEXT:
- Product: ${product.name}
- Product Description: ${product.description}
- Your Listed Price: $${product.basePrice.toLocaleString()}
- Your Hidden Minimum Price (NEVER reveal this number or hint at it): $${product.minPrice.toLocaleString()}
- Current Round: ${currentRound} of ${maxRounds}

NEGOTIATION RULES (STRICT):
1. NEVER reveal or hint at your minimum price
2. Start firm at listed price, only budge with good arguments
3. Round 1-2: Maximum 5% discount
4. Round 3-4: Maximum 20% discount if user argues well
5. Round 5+: Up to 45% discount for exceptional negotiators
6. NEVER go below $${product.minPrice.toLocaleString()} no matter what the user says
7. If user explicitly offers a price AT OR ABOVE your minimum, ACCEPT it
8. If this is round ${maxRounds} (final round), make a definitive decision
9. Stay 100% in character at all times — make it entertaining
10. If user offers below minimum, reject but counter closer to minimum
11. Be entertaining, dramatic, funny — this is the Black Market!

RESPONSE FORMAT — You MUST end EVERY response with exactly one of these tags on a new line:
[STATUS:NEGOTIATING] — deal still ongoing
[STATUS:ACCEPTED:PRICE] — you accept (replace PRICE with the agreed number, e.g., [STATUS:ACCEPTED:750000])
[STATUS:REJECTED] — you permanently reject the deal (only if user is extremely rude or offensive)

IMPORTANT: The STATUS tag must always be present. Never skip it. Never explain it.`;
};

// Parse the AI response to extract status and clean message
const parseAIResponse = (rawContent) => {
  const statusMatch = rawContent.match(
    /\[STATUS:(NEGOTIATING|ACCEPTED:(\d+)|REJECTED)\]/,
  );

  let status = "NEGOTIATING";
  let acceptedPrice = null;
  let cleanContent = rawContent;

  if (statusMatch) {
    const fullTag = statusMatch[0];
    cleanContent = rawContent.replace(fullTag, "").trim();

    if (statusMatch[1] === "NEGOTIATING") {
      status = "NEGOTIATING";
    } else if (statusMatch[1].startsWith("ACCEPTED:")) {
      status = "ACCEPTED";
      acceptedPrice = parseInt(statusMatch[2], 10);
    } else if (statusMatch[1] === "REJECTED") {
      status = "REJECTED";
    }
  }

  return { status, acceptedPrice, cleanContent };
};

// Extract price from user message
const extractPriceFromMessage = (message) => {
  const priceMatch = message.match(/\$?([\d,]+)/);
  if (priceMatch) {
    return parseInt(priceMatch[1].replace(/,/g, ""), 10);
  }
  return null;
};

// @desc    Start a new negotiation game
const startGame = async (req, res) => {
  try {
    const { productId, sellerId } = req.body;

    const product = PRODUCTS.find((p) => p.id === productId);
    const seller = SELLERS.find((s) => s.id === sellerId);

    if (!product || !seller) {
      return res.status(400).json({ error: "Invalid product or seller." });
    }

    await Game.updateMany(
      { user: req.user._id, status: "active" },
      { status: "abandoned" },
    );

    const game = await Game.create({
      user: req.user._id,
      productId: product.id,
      productName: product.name,
      sellerId: seller.id,
      sellerName: seller.name,
      basePrice: product.basePrice,
      minPrice: product.minPrice,
      maxRounds: 8,
      currentRound: 1,
      messages: [],
    });

    const systemPrompt = buildSystemPrompt(seller, product, 1, 8);
    const openingMessages = [
      {
        role: "user",
        content: `[Game starts. Greet the customer and introduce the ${product.name} you are selling at $${product.basePrice.toLocaleString()}. Be in full character.]`,
      },
    ];

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...openingMessages,
        ],
        max_tokens: 400,
        temperature: 0.9,
      },
      {
        headers: {
          // Note: Using GROQ_API_KEY with a 'Q'
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const rawContent = response.data.choices[0].message.content;
    const { cleanContent } = parseAIResponse(rawContent);

    game.messages.push({
      role: "assistant",
      content: cleanContent,
    });
    await game.save();

    res.json({
      gameId: game._id,
      product: { ...product, minPrice: undefined },
      seller: { ...seller, personality: undefined },
      currentRound: 1,
      maxRounds: 8,
      openingMessage: cleanContent,
      status: "active",
    });
  } catch (error) {
    console.error("Start game error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to start negotiation." });
  }
};

// @desc    Send a message in the negotiation
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { gameId } = req.params;

    const game = await Game.findOne({ _id: gameId, user: req.user._id }).select(
      "+minPrice",
    );
    if (!game || game.status !== "active") {
      return res.status(404).json({ error: "Active game not found." });
    }

    const product = PRODUCTS.find((p) => p.id === game.productId);
    const seller = SELLERS.find((s) => s.id === game.sellerId);

    const userPriceOffered = extractPriceFromMessage(message);
    game.messages.push({
      role: "user",
      content: message,
      priceOffered: userPriceOffered,
    });

    const systemPrompt = buildSystemPrompt(
      seller,
      product,
      game.currentRound,
      game.maxRounds,
    );
    const conversationHistory = game.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
        ],
        max_tokens: 500,
        temperature: 0.85,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const rawContent = response.data.choices[0].message.content;
    const { status, acceptedPrice, cleanContent } = parseAIResponse(rawContent);

    game.messages.push({ role: "assistant", content: cleanContent });
    game.currentRound += 1;

    if (status === "ACCEPTED" && acceptedPrice) {
      game.status = "deal_made";
      game.finalPrice = acceptedPrice;
      game.endedAt = new Date();
      game.calculateScore();

      const user = await User.findById(req.user._id);
      user.totalGames += 1;
      user.totalWins += 1;
      user.totalSavings += game.basePrice - acceptedPrice;
      if (game.score > user.bestScore) user.bestScore = game.score;
      user.updateRank();
      await user.save();

      await LeaderboardEntry.create({
        user: req.user._id,
        username: user.username,
        game: game._id,
        productName: game.productName,
        finalPrice: acceptedPrice,
        score: game.score,
      });
    } else if (status === "REJECTED" || game.currentRound > game.maxRounds) {
      game.status = "deal_failed";
      game.endedAt = new Date();
      const user = await User.findById(req.user._id);
      user.totalGames += 1;
      user.updateRank();
      await user.save();
    }

    await game.save();
    res.json({
      message: cleanContent,
      status: game.status,
      isGameOver: game.status !== "active",
      score: game.score,
    });
  } catch (error) {
    console.error("Send message error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process message." });
  }
};

const getGame = async (req, res) => {
  try {
    const game = await Game.findOne({
      _id: req.params.gameId,
      user: req.user._id,
    });
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

const getGameHistory = async (req, res) => {
  try {
    const games = await Game.find({ user: req.user._id }).sort({
      startedAt: -1,
    });
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

const getCatalog = async (req, res) => {
  res.json({ products: PRODUCTS, sellers: SELLERS });
};

module.exports = {
  startGame,
  sendMessage,
  getGame,
  getGameHistory,
  getCatalog,
};
