const Input = ({ inputState, inputDispatch }) => {
  const handleChange = (field) => (event) =>
    inputDispatch({
      type: field,
      payload: { value: event.target.value },
    });

  return (
    <div className="font-poppins">
      <div className="flex flex-col md:flex-row md:items-start text-[16px] md:text-[20px] text-black font-semibold mt-[32px] md:mt-[32px] w-[75vw]">
        <div className="flex flex-col w-full md:w-1/2">
          <p className="text-[#FFFFFF] ml-[2px]">First Name</p>
          <input
            className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px] font-normal"
            placeholder="First Name"
            value={inputState.firstName}
            onChange={handleChange("firstName")}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 md:ml-[20px]">
          <p className="text-[#FFFFFF] ml-[2px] mt-[16px] md:mt-0">Last Name</p>
          <input
            className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px] font-normal"
            placeholder="Last Name"
            value={inputState.lastName}
            onChange={handleChange("lastName")}
          />
        </div>
      </div>
      <div className="flex flex-col mt-[32px] text-black">
        <p className="text-[#FFFFFF] text-[16px] md:text-[20px] font-semibold ml-[2px]">
          Email
        </p>
        <input
          className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]"
          placeholder="Email"
          value={inputState.email}
          onChange={handleChange("email")}
        />
      </div>
      <div className="flex flex-col mt-[32px] text-black">
        <p className="text-[#FFFFFF] text-[16px] md:text-[20px] font-semibold ml-[2px]">
          Phone Number
        </p>
        <input
          className="w-full h-[45px] md:h-[60px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]"
          placeholder="Phone Number"
          value={inputState.phoneNumber}
          onChange={handleChange("phoneNumber")}
        />
      </div>
      <div className="flex flex-col mt-[32px] text-black">
        <p className="text-[#FFFFFF] text-[16px] md:text-[20px] font-semibold ml-[2px]">
          Message
        </p>
        <textarea
          className="w-full h-[120px] md:h-[180px] rounded-[8px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[10px] pt-[10px] text-[14px] md:text-[18px] mt-[8px] md:mt-[16px]"
          placeholder="Message"
          value={inputState.message}
          onChange={handleChange("message")}
        />
      </div>
    </div>
  );
};

export default Input;
