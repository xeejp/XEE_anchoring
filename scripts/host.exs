defmodule Anchoring.Host do
  alias Anchoring.Main
  alias Anchoring.Actions

  require Logger

  # Actions
  def fetch_contents(data) do
    data
    |> Actions.update_host_contents()
  end

  def change_page(data, page) do
    if page in Main.pages do
      %{data | page: page}
      |> Actions.change_page(page)
    else
      data
    end
  end

  def all_reset(data) do
    :random.seed(:os.timestamp)
    flag = true
    data = data |> Map.put(:participants, Enum.into(Enum.map(data.participants, fn { id, _ } ->
      rnd = :random.uniform(data.question_text["max"] - data.question_text["min"]) - data.question_text["min"]
      {id,
        %{
          question_text: data.question_text,
          sequence: "question",
          answer: rnd,
          sdef: rnd,
          active: true,
          joined: Map.size(data.participants),
        }
      }
    end), %{}))
                |> Map.put(:joined, Map.size(data.participants))
                |> Map.put(:answered, 0)
    Actions.all_reset(data)
  end

  def send_result(data, result) do
    data = data |> Map.put(:result, result)
                    |> Map.put(:participants, Enum.into(Enum.map(data.participants, fn {id, value} ->
      {id, value |> Map.put(:result, result)} end), %{}))
    Actions.send_result(data, result)
  end

  def update_question(data, question_text) do
    data = data |> Map.put(:question_text, question_text)
                     |> Map.put(:participants, Enum.into(Enum.map(data.participants, fn { id, value } ->
                       { id, value |> Map.put(:question_text, question_text) } end), %{}))
    Actions.update_question(data, question_text)
  end

  # Utilities
  def format_contents(data) do
    data
  end
end