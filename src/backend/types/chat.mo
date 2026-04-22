import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type MessageRole = Common.MessageRole;

  /// A single chat message (shared-safe: no var fields, no containers)
  public type ChatMessage = {
    role : MessageRole;
    content : Text;
    timestamp : Timestamp;
  };

  /// Metadata attached to an AI response
  public type ResponseMetadata = {
    model : Text;
    processingTimeMs : Nat;
    tokenEstimate : Nat;
  };

  /// Full response returned from sendMessage
  public type BotResponse = {
    message : ChatMessage;
    metadata : ResponseMetadata;
  };
};
