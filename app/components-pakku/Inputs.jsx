const Input = () => {
  return(
    <div className="font-poppins">
      <div className="flex text-[30px] font-semibold mt-[64px]">
        <p className="text-[#FFFFFF] ml-[2px]">First Name</p>
        <p className="text-[#FFFFFF] ml-[421px]">Last Name</p>
      </div>
      <div className="flex w-[1107px] justify-between">
        <input className="w-[529px] h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]" placeholder="First Name"/>
        <input className="w-[529px] h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]" placeholder="Last Name"/>
      </div>
      <div>
        <div className="flex text-[30px] font-semibold mt-[60px]">
          <p className="text-[#FFFFFF] ml-[2px]">Email</p>
        </div>
        <div className="flex w-[1107px] justify-between">
          <input className="w-[1107px] h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]" placeholder="Email"/>
      </div>
      </div>
      <div>
        <div className="flex text-[30px] font-semibold mt-[30px]">
          <p className="text-[#FFFFFF] ml-[2px]">Phone Number</p>
        </div>
        <div className="flex w-[1107px] justify-between">
          <input className="w-[1107px] h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]" placeholder="Phone Number"/>
      </div>
      </div>
      <div>
        <div className="flex text-[30px] font-semibold mt-[60px]">
          <p className="text-[#FFFFFF] ml-[2px]">Message</p>
        </div>
        <div className="flex w-[1107px] justify-between">
          <input className="w-[1107px] h-[285px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] pb-[220px] text-[25px]" placeholder="Message"/>
      </div>
      </div>
    </div>
  );
};

export default Input;