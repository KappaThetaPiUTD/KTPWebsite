import Image from "next/image";

const Group = () => {
  return (
    <div>
      <style>
        {`
                `}
      </style>
      <div className="text-center">
        <div className="relative w-screen h-[545px]">
          <Image
            className="w-full h-auto opacity-100 text-gray object-cover"
            src={"/pictures/exec-group.jpeg"}
            alt="Executive Board"
            fill
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default Group;
