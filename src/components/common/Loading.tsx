import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingProps {
  tip?: string;
}

export default function Loading({ tip = "Cargando..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spin indicator={<LoadingOutlined spin />} tip={tip} size="large" />
    </div>
  );
}
