defmodule Anchoring.Actions do
  alias Anchoring.Participant
  alias Anchoring.Host

  def change_page(data, page) do
    action = get_action("change page", page)
    format(data, nil, dispatch_to_all(data, action))
  end

  def join(data, id, participant) do
    data = data |> Map.put(:joined, data.joined + 1)
    haction = get_action("join", %{id: id, participant: participant, joined: data.joined})
    paction = get_action("joined", Map.size(data.participants))
    format(data, haction, dispatch_to_all(data, paction))
  end
  
  def update_host_contents(data) do
    host = get_action("update contents", Host.format_contents(data))
    format(data, host)
  end

  def all_reset(data) do
    haction = get_action("reset", %{ participants: data.participants, joined: data.joined, answered: data.answered })
    paction = get_action("reset", %{
         question_text: data.question_text,
          sequence: "question",
          active: true,
          joined: Map.size(data.participants)
        })
    all = Enum.reduce(data.participants, %{}, fn {id, value}, acc -> dispatch_to(acc, id, paction |> put_in([:payload, :answer], value.answer) |> put_in([:payload, :sdef], value.sdef)) end)
    format(data, haction, all)
  end

  def send_result(data, result) do
    paction = get_action("result", result)
    format(data, nil, dispatch_to_all(data, paction))
  end

  def update_question(data, question_text) do
    haction = get_action("qupdate", question_text)
    paction = get_action("qupdate", question_text)
    format(data, haction, dispatch_to_all(data, paction))
  end

  def update_participant_contents(data, id) do
    participant = dispatch_to(id, get_action("update contents", Participant.format_contents(data, id)))
    format(data, nil, participant)
  end

  def answer(data, id, selected) do
    haction = get_action("answer", %{id: id, participant: data.participants[id], answered: data.answered})
    paction = get_action("answered", %{ sequence: "answer", answer: selected })
    format(data, haction, dispatch_to(id, paction))
  end

  # Utilities

  defp get_action(type, params) do
    %{
      type: type,
      payload: params
    }
  end

  defp dispatch_to(map \\ %{}, id, action) do
    Map.put(map, id, %{action: action})
  end

  defp dispatch_to_all(%{participants: participants}, action) do
    Enum.reduce(participants, %{}, fn {id, _}, acc -> dispatch_to(acc, id, action) end)
  end

  defp format(data, host, participants \\ nil) do
    result = %{"data" => data}
    unless is_nil(host) do
      result = Map.put(result, "host", %{action: host})
    end
    unless is_nil(participants) do
      result = Map.put(result, "participant", participants)
    end
    {:ok, result}
  end
end
