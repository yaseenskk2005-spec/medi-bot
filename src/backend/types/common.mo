module {
  /// Unix timestamp in nanoseconds (from Time.now())
  public type Timestamp = Int;

  /// Role of a message participant
  public type MessageRole = { #user; #assistant };
};
