defmodule Anchoring.Main do
  alias Anchoring.Actions

  @pages ["waiting", "experiment", "result"]
  @sequence ["question1", "question2", "answered"]

  def pages, do: @pages
  def sequence, do: @sequence

  def init do
    %{
      page: "waiting",
      participants: %{},
      joined: 0,
      answered: 0,
      question_text: %{
        'question': "国連でアフリカ諸国が占める割合は何％か？",
        'answered': "回答は終了しました。",
        'waiting_text': "参加者の登録を待っています。\nこの画面のまましばらくお待ちください。",
        'min': 0,
        'step': 1,
        'max': 100,
        'unit': "%"
      },
      result: []
    }
  end

  def new_participant(data) do
    %{
      question_text: data.question_text,
      sequence: "question",
      sdef: -1,
      answer: -1,
      active: true,
      joined: 1,
      result: []
    }
  end

  def join(data, id) do
    unless Map.has_key?(data.participants, id) do
      new = new_participant(data)
      new = new |> Map.put(:joined, Map.size(data.participants) + 1)
      data = data |> Map.put(:participants, Enum.into(Enum.map(data.participants, fn {id, map} ->
        {id, Map.put(map, :joined, Map.size(data.participants) + 1)}
      end), %{}))
      put_in(data, [:participants, id], new)
      |> Actions.join(id, new)
    else
      data
    end
  end

  def wrap(data) do
    {:ok, %{"data" => data}}
  end
end