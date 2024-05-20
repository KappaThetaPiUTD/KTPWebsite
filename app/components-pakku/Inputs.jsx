const Input = () => {
  return (
    <div className="font-poppins">
      <div className="flex flex-col md:flex-row md:items-start text-[16px] md:text-[20px] font-semibold mt-[32px] md:mt-[32px]">
        <div className="flex flex-col w-full md:w-1/2">
          <p className="text-[#FFFFFF] ml-[2px]">First Name</p>
          <input className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]" placeholder="First Name"/>
        </div>
        <div className="flex flex-col w-full md:w-1/2 md:ml-[20px]">
          <p className="text-[#FFFFFF] ml-[2px] mt-[16px] md:mt-0">Last Name</p>
          <input className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]" placeholder="Last Name"/>
        </div>
      </div>
      <div className="flex flex-col mt-[32px]">
        <p className="text-[#FFFFFF] text-[16px] md:text-[20px] font-semibold ml-[2px]">Email</p>
        <input className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]" placeholder="Email"/>
      </div>
      <div className="flex flex-col mt-[32px]">
        <p className="text-[#FFFFFF] text-[16px] md:text-[20px] font-semibold ml-[2px]">Phone Number</p>
        <input className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]" placeholder="Phone Number"/>
      </div>
      <div className="flex flex-col mt-[32px]">
        <p className="text-[#FFFFFF] text-[16px] md:text-[20px] font-semibold ml-[2px]">Message</p>
        <textarea className="w-full h-[120px] md:h-[180px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] pt-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]" placeholder="Message"/>
      </div>
    </div>
  );
};

export default Input;
