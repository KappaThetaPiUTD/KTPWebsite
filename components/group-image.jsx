import Image from "next/image";

const Group = () => {
  return (
    <div className="text-center">
      <div className="relative w-screen h-[300px] sm:h-[545px] bottom-[22px]">
        <Image
          className="w-full h-auto opacity-100 text-gray object-cover"
          src={"/pictures/exec-group.jpeg"}
          alt="Executive Board"
          fill
          unoptimized
        />
      </div>
    </div>
  );
};

export default Group;
