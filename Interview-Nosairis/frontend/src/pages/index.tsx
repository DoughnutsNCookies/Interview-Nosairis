import { NavigateButtonProps } from "@/interfaces/NavigateButtonProps";
import { useEffect, useState } from "react";
import { getGraphData } from "./helpers/getGraphData";

export default function Home() {
  return (
    <main className="bg-blue-950">
      <Graphs />
      <hr className="border-2" />
      <Alerts />
      <hr className="border-2" />
      <Edits />
    </main>
  );
}

const Graphs = () => {
  const [graphData, setGraphData] = useState<HTMLImageElement[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getGraphData(page).then((newData) => {
      setGraphData(newData);
    });
  }, [page]);

  const handlePageChange = (forward: boolean) => {
    if (forward) {
      setPage(page === 60 ? 1 : page + 1);
    } else {
      setPage(page === 1 ? 60 : page - 1);
    }
  };

  const NavigateButton = (props: NavigateButtonProps) => {
    const { forward, onClick } = props;

    return (
      <button
        className="border-2 border-white rounded-md py-1 px-4"
        onClick={onClick}
      >
        {forward ? "Forward Hour" : "Previous Hour"}
      </button>
    );
  };

  return (
    <div className="h-screen">
      <h1 className="text-center text-4xl pt-4 pb-2">Graph Chart</h1>
      <div className="py-4 flex flex-col items-center">
        {graphData.map((image, index) => (
          <img
            className="px-5 max-h-[260px]"
            key={index}
            src={image.src}
            alt={`Image ${index}`}
          />
        ))}
      </div>
      <div className=" flex flex-row justify-center gap-x-10 pb-5">
        <NavigateButton
          forward={false}
          onClick={() => handlePageChange(false)}
        />
        <NavigateButton forward={true} onClick={() => handlePageChange(true)} />
      </div>
    </div>
  );
};

interface AlertData {
  switch_label: string;
  time: string;
}

const Alerts = () => {
  const [alertData, setAlertData] = useState<AlertData[]>([]);

  useEffect(() => {
    const getAlerts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/switch_status/alert",
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAlertData(data);
        } else {
          console.error("Bad response");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAlerts();
  }, []);

  return (
    <div className="h-screen px-10">
      <h1 className="text-center text-4xl py-10">Alert Page</h1>
      <div className="max-h-[750px] overflow-y-auto border-2">
        <table className="w-full">
          <thead className="border-2">
            <tr>
              <th className="border-2">Index</th>
              <th className="border-2">Switch Label</th>
              <th className="border-2">Alert Type</th>
              <th className="border-2">Time</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {alertData.map((alert, index) => (
              <tr className="border-2" key={index}>
                <td className="border-2">{index}</td>
                <td className="border-2">{alert.switch_label}</td>
                <td className="border-2">Ping Lost</td>
                <td className="border-2">{alert.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Edits = () => {
  return <div className="h-screen">Edit Page</div>;
};
