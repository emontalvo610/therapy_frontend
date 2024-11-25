"use client";
import { useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

export default function Home() {
  const [keyPhrase, setKeyPhrase] = useState("");
  const [responseCount, setResponseCount] = useState(10);
  const [records, setRecords] = useState([]);

  const [debouncedKeyPhrase] = useDebounceValue(keyPhrase, 300);
  const [debouncedResponeCount] = useDebounceValue(responseCount, 300);

  const fetchData = async () => {
    if (!debouncedKeyPhrase) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search?query=${debouncedKeyPhrase}&size=${debouncedResponeCount}`
      );

      if (response.ok) {
        const { data } = await response.json();
        setRecords(data);
      } else alert("Error while fetching the data");
    } catch (err) {
      alert("Error while fetching the data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedKeyPhrase, debouncedResponeCount]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-5xl">Therapy Analysis</h1>

      <div className="flex flex-col gap-5 w-full h-full">
        <div className="flex justify-start gap-5 w-full">
          <span>Key Phrase: </span>
          <input
            type="text"
            value={keyPhrase}
            onChange={(e) => setKeyPhrase(e.target.value)}
            className="border border-solid border-black"
            data-testid="test-keyword"
          />
        </div>
        <div className="flex justify-start gap-5 w-full">
          <span>Number of response: </span>
          <input
            type="number"
            value={responseCount}
            onChange={(e) => setResponseCount(Number(e.target.value))}
            className="border border-solid border-black"
            min="10"
            max="50"
          />
        </div>
        {records.length ? (
          <table className="border-collapse border">
            <thead>
              <tr>
                <td className="p-2 border border-1 border-black">id</td>
                <td className="p-2 border border-1 border-black">score</td>
                <td className="p-2 border border-1 border-black">context</td>
                <td className="p-2 border border-1 border-black">response</td>
              </tr>
            </thead>
            <tbody>
              {records.map(
                ({
                  _id,
                  _score,
                  _source,
                }: {
                  _id: string;
                  _score: string;
                  _source: {
                    Context: string;
                    Response: string;
                  };
                }) => (
                  <tr key={_id} data-testid="test-result-row">
                    <td className="p-2 border border-1 border-black">{_id}</td>
                    <td className="p-2 border border-1 border-black">
                      {_score}
                    </td>
                    <td className="p-2 border border-1 border-black">
                      {_source.Context}
                    </td>
                    <td className="p-2 border border-1 border-black">
                      {_source.Response}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <h4 className="text-2xl">No data to display!</h4>
        )}
      </div>
    </div>
  );
}
