defmodule Anchoring.Participant do
  alias Anchoring.Actions

  # Actions
  def fetch_contents(data, id) do
    Actions.update_participant_contents(data, id)
  end

  def answer(data, id, selected) do
    data = data |> put_in([:participants, id, :sequence], "answer")
                    |> put_in([:participants, id, :answer], selected)
                    |> Map.put(:answered, data.answered + 1)
    Actions.answer(data, id, selected)
  end

  # Utilities
  def format_participant(participant), do: participant

  def format_data(data) do
    %{
      page: data.page,
    }
  end

  def format_contents(data, id) do
    %{participants: participants} = data
    participant = Map.get(participants, id)
    format_participant(participant)
      |> Map.merge(format_data(data))
  end
end
