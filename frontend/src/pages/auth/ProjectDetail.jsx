import { useParams } from "react-router-dom";

const ProjectDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-xl font-semibold">
        Project Detail - ID: {id}
      </h1>
    </div>
  );
};

export default ProjectDetail;