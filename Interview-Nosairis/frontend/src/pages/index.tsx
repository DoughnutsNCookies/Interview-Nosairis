import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main>
      <div>
        <Graphs />
      </div>
    </main>
  );
}

const Graphs = () => {
  const [graphData, setGraphData] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const getGraphData = async () => {
      try {
        const response = await fetch("http://localhost:8000/switch_status/", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          const image_list: string[] = data.images;
          const images = image_list.map(imageData => {
            const image = new Image();
            image.src = `data:image/png;base64,${imageData}`;
            return image;
          })
          setGraphData(images);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getGraphData();
  }, []);

  return (
    <div>
      {/* Render the images */}
      {graphData.map((image, index) => (
        <img key={index} src={image.src} alt={`Image ${index}`} />
      ))}
    </div>
  );
};
