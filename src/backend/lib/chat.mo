import List "mo:core/List";
import Text "mo:core/Text";
import Types "../types/chat";

module {
  public type ChatMessage = Types.ChatMessage;
  public type BotResponse = Types.BotResponse;

  /// Medical system context prompt injected at the start of every conversation.
  let SYSTEM_PROMPT : Text = "You are MediBot, an advanced AI medical assistant. Provide accurate, evidence-based medical information to help users understand health topics, symptoms, medications, and preventive care. Always remind users that your information is educational and does not replace professional medical advice. Encourage users to consult healthcare providers for diagnosis and treatment. Be compassionate, clear, and thorough in your responses.";

  /// Append a user message to history and return the new entry.
  public func addUserMessage(
    history : List.List<ChatMessage>,
    content : Text,
    timestamp : Types.Timestamp,
  ) : ChatMessage {
    let msg : ChatMessage = {
      role = #user;
      content = content;
      timestamp = timestamp;
    };
    history.add(msg);
    msg;
  };

  /// Escape a text value for safe embedding in a JSON string.
  func escapeJson(s : Text) : Text {
    var result = s;
    result := result.replace(#char '\\', "\\\\");
    result := result.replace(#text "\"", "\\\"");
    result := result.replace(#char '\n', "\\n");
    result := result.replace(#char '\r', "\\r");
    result := result.replace(#char '\t', "\\t");
    result;
  };

  /// Serialize a single message to a JSON object string.
  func messageToJson(msg : ChatMessage) : Text {
    let roleText = switch (msg.role) {
      case (#user) "user";
      case (#assistant) "assistant";
    };
    "{\"role\":\"" # roleText # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
  };

  /// Build the OpenRouter-compatible POST body JSON from conversation history.
  public func buildRequestBody(history : List.List<ChatMessage>) : Text {
    // Prepend the system message
    var messagesJson = "[{\"role\":\"system\",\"content\":\"" # escapeJson(SYSTEM_PROMPT) # "\"}";

    history.forEach(func(msg : ChatMessage) {
      messagesJson := messagesJson # "," # messageToJson(msg);
    });
    messagesJson := messagesJson # "]";

    "{\"model\":\"mistralai/mistral-7b-instruct:free\",\"messages\":" # messagesJson # ",\"max_tokens\":512,\"temperature\":0.7}";
  };

  /// Extract the assistant reply text from a raw OpenRouter JSON response.
  /// Uses simple text scanning since Motoko has no JSON parser.
  func extractContent(raw : Text) : Text {
    let fallback = "I'm sorry, I couldn't process your request at this time.";
    // Look for "content":"..." pattern; we want the last occurrence (assistant reply).
    let marker = "\"content\":\"";
    var segIter = raw.split(#text marker);
    // Collect all segments after the marker
    var lastSegment : ?Text = null;
    ignore segIter.next(); // skip prefix before first marker
    label segloop while (true) {
      switch (segIter.next()) {
        case null { break segloop };
        case (?seg) { lastSegment := ?seg };
      };
    };
    switch lastSegment {
      case null fallback;
      case (?segment) {
        // Split on closing double-quote, taking everything before it.
        // The segment starts right after the opening quote of the content value.
        // First handle escape sequences by splitting on backslash then reassembling.
        // Simpler: take everything up to the first unescaped quote by splitting on `"`
        // and then re-joining escaped sequences.
        var parts = segment.split(#text "\"");
        // The first part is content before the closing quote — but may have embedded
        // escape sequences from the JSON. We process it as plain text.
        switch (parts.next()) {
          case null fallback;
          case (?firstPart) {
            // Replace JSON escape sequences in the extracted content
            var content = firstPart;
            content := content.replace(#text "\\n", "\n");
            content := content.replace(#text "\\r", "\r");
            content := content.replace(#text "\\t", "\t");
            content := content.replace(#text "\\\\", "\\");
            if (content == "") fallback else content;
          };
        };
      };
    };
  };

  /// Estimate token count (rough approximation: 1 token ≈ 4 characters).
  func estimateTokens(text : Text) : Nat {
    (text.size() + 3) / 4;
  };

  /// Parse the raw AI service JSON response text into a BotResponse.
  public func parseAiResponse(
    rawJson : Text,
    timestamp : Types.Timestamp,
    processingTimeMs : Nat,
  ) : BotResponse {
    let content = extractContent(rawJson);
    let assistantMsg : ChatMessage = {
      role = #assistant;
      content = content;
      timestamp = timestamp;
    };
    let metadata : Types.ResponseMetadata = {
      model = "mistralai/mistral-7b-instruct:free";
      processingTimeMs = processingTimeMs;
      tokenEstimate = estimateTokens(content);
    };
    {
      message = assistantMsg;
      metadata = metadata;
    };
  };

  /// Return the 6 pre-defined medical quick-start suggestion strings.
  public func defaultSuggestions() : [Text] {
    [
      "What are the symptoms of flu?",
      "Common side effects of ibuprofen?",
      "When should I see a doctor for a headache?",
      "What is normal blood pressure?",
      "How to manage type 2 diabetes?",
      "Signs of dehydration?",
    ];
  };

  /// Snapshot history as a shared-safe immutable array.
  public func historySnapshot(history : List.List<ChatMessage>) : [ChatMessage] {
    history.toArray();
  };
};
