
export const GetColorMethodHelper = ({ method }: { method: string }) => {
    const getColor = (method: string) => {
      switch (method) {
        case "POST":
          return "#49CC90";
        case "GET":
            return "#61AFFE"
        case "PATCH":
          return "#50E3C2";
        case "DELETE":
          return "#F93E3E";
        default:
          return "black";
      }
    };
  
    return <span style={{ color: getColor(method) }}>{method}</span>;
  }