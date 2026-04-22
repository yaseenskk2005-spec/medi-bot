import Int "mo:core/Int";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/chat";
import ChatLib "../lib/chat";

/// Per-caller chat history stored keyed by Principal.
mixin (callerHistories : Map.Map<Principal, List.List<Types.ChatMessage>>) {

  /// OpenRouter API key placeholder — replace with actual key in production.
  let AI_API_URL : Text = "https://openrouter.ai/api/v1/chat/completions";
  let AI_API_KEY : Text = "sk-or-v1-placeholder-replace-with-real-key";

  /// Retrieve or create the history list for the calling principal.
  func getOrCreateHistory(caller : Principal) : List.List<Types.ChatMessage> {
    switch (callerHistories.get(caller)) {
      case (?existing) existing;
      case null {
        let fresh = List.empty<Types.ChatMessage>();
        callerHistories.add(caller, fresh);
        fresh;
      };
    };
  };

  /// Transform callback required by the IC HTTP outcalls consensus mechanism.
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Send a user message to the AI service and return the bot response.
  public shared ({ caller }) func sendMessage(userMessage : Text) : async Types.BotResponse {
    let history = getOrCreateHistory(caller);
    let startTime = Time.now();

    // Record the user message in history
    ignore ChatLib.addUserMessage(history, userMessage, startTime);

    // Build request JSON including conversation history
    let requestBody = ChatLib.buildRequestBody(history);

    // Call the AI service via http-outcalls
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # AI_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://medibot.ic" },
      { name = "X-Title"; value = "MediBot" },
    ];

    let rawResponse = await OutCall.httpPostRequest(AI_API_URL, headers, requestBody, transform);

    let endTime = Time.now();
    let processingMs = Int.abs(endTime - startTime) / 1_000_000;

    let response = ChatLib.parseAiResponse(rawResponse, endTime, processingMs);

    // Store the assistant reply in history
    history.add(response.message);

    response;
  };

  /// Return 6 curated medical quick-start query suggestions.
  public query func getSuggestions() : async [Text] {
    ChatLib.defaultSuggestions();
  };

  /// Clear all stored conversation history for the calling principal.
  public shared ({ caller }) func clearHistory() : async () {
    callerHistories.remove(caller);
  };
};
