export const getGraphData = async (page: number) => {
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