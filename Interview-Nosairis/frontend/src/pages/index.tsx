import { NavigateButtonProps } from "@/interfaces/NavigateButtonProps";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className=" bg-blue-950">
      <div>
        <Graphs />
      </div>
    </main>
  );
}

const getGraphData = async (page: number) => {
  try {
    const response = await fetch("http://localhost:8000/switch_status?page=" + page, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      const image_list: string[] = data.images;
      const images = image_list.map((imageData) => {
        const image = new Image();
        image.src = `data:image/png;base64,${imageData}`;
        return image;
      });
      return images;
    } else {
      console.error("Bad response");
    }
  } catch (error) {
    console.error(error);
  }
  return [];
};

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

  return (
    <div>
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

const NavigateButton = (props: NavigateButtonProps) => {
  const { forward, onClick } = props;

  return (
    <button className="border-2 border-white rounded-md py-1 px-4" onClick={onClick}>
      {forward ? "Forward Hour" : "Previous Hour"}
    </button>
  );
};
