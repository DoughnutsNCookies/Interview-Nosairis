import { NavigateButtonProps } from "@/interfaces/NavigateButtonProps";
import { useEffect, useState } from "react";
import { getGraphData } from "./helpers/getGraphData";

export default function Home() {
  return (
    <main className="bg-blue-950">
      <Graphs />
      <hr className="border-2"/>
      <Alerts />
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
      <button className="border-2 border-white rounded-md py-1 px-4" onClick={onClick}>
        {forward ? "Forward Hour" : "Previous Hour"}
      </button>
    );
  };

  return (
    <div className="h-screen">
      <div className="py-4 flex flex-col items-center">
        {graphData.map((image, index) => (
          <img
            className="px-5 max-h-[280px]"
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
        <NavigateButton 
          forward={true}
          onClick={() => handlePageChange(true)}
        />
      </div>
    </div>
  );
};

const Alerts = () => {
  return (<div className="h-screen">Alert</div>);
}