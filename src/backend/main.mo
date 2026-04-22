import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "types/chat";
import ChatApi "mixins/chat-api";

actor {
  /// Per-caller chat histories, keyed by Principal.
  let callerHistories = Map.empty<Principal, List.List<Types.ChatMessage>>();

  include ChatApi(callerHistories);
};
