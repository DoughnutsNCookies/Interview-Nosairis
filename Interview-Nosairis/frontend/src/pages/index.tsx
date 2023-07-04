import { NavigateButtonProps } from "@/interfaces/NavigateButtonProps";
import { useEffect, useState } from "react";
import { getGraphData } from "./helpers/getGraphData";
import { AlertData } from "@/interfaces/AlertData";

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
    <div className="h-[940px]">
      <h1 className="text-center text-4xl pt-4 pb-2">Graph Chart</h1>
      <div className="py-4 flex flex-col items-center">
        {graphData.map((image, index) => (
          <img
            className="px-5 max-h-[240px]"
            key={index}
            src={image.src}
            alt={`Image ${index}`}
          />
        ))}
      </div>
      <div className=" flex flex-row justify-center gap-x-10 pb-6 pt-4">
        <NavigateButton
          forward={false}
          onClick={() => handlePageChange(false)}
        />
        <NavigateButton forward={true} onClick={() => handlePageChange(true)} />
      </div>
    </div>
  );
};

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
      <div className="h-[80%] overflow-y-auto border-2">
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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [selectedSwitch, setSelectedSwitch] = useState<string>("S1");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(parseInt(event.target.value));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSwitch(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleSubtmit = async () => {
    if (selectedSwitch === "" || selectedDate === "" || selectedTime === "")
      return console.log("Please fill in all fields");
    const data = {
      switch_label: selectedSwitch,
      T1: selectedStatus,
      T2: selectedStatus,
      T3: selectedStatus,
      T4: selectedStatus,
      T5: selectedStatus,
      TS: new Date(selectedDate + " " + selectedTime).getTime() / 1000,
    };
    try {
      const response = await fetch("http://localhost:8000/switch_status/", {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen px-36">
      <h1 className="text-center text-4xl pt-10">Edit Page</h1>
      <h2 className="text-center text-sm mx-12 pt-2 pb-10">If a match is found in the database (same switch label, date and time), status will update, else it would insert as new data</h2>
      <div className="flex flex-col">
        <span className="text-2xl">Switch Label:</span>
        <select className="text-black text-xl" value={selectedSwitch} onChange={handleSwitchChange}>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
        </select>
      </div>
      <div className="flex flex-col pt-5">
        <span className="text-2xl">Date:</span>
        <input className="text-black text-xl" type="date" value={selectedDate} onChange={handleDateChange} />
      </div>
      <div className="flex flex-col pt-5">
        <span className="text-2xl">Time:</span>
        <input className="text-black text-xl" type="time" value={selectedTime} onChange={handleTimeChange} />
      </div>
      <div className="flex flex-col pt-5">
        <span className="text-2xl">Status:</span>
        <select className="text-black text-xl" value={selectedStatus} onChange={handleStatusChange}>
          <option value={0}>0</option>
          <option value={1}>1</option>
        </select>
      </div>
      <div className="pt-10 w-full text-center">
        <button className="border-2 rounded-md px-10 py-2 text-2xl" onClick={handleSubtmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
