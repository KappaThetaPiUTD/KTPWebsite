const Input = ({ inputState, inputDispatch }) => {
  const handleChange = (field) => (event) =>
    inputDispatch({
      type: field,
      payload: { value: event.target.value },
    });

  return (
    <div className="font-poppins text-black w-4/5">
      <div className="flex flex-row flex-wrap justify-between mt-[60px] gap-y-[60px]">
        <div className="w-full lg:w-[45%]">
          <div className="flex text-[30px] font-semibold">
            <p className="text-[#FFFFFF] ml-[2px]">First Name</p>
          </div>
          <div className="flex w-full justify-between">
            <input
              className="w-full h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]"
              placeholder="First Name"
              value={inputState.firstName}
              onChange={handleChange("firstName")}
            />
          </div>
        </div>
        <div className="w-full lg:w-[45%]">
          <div className="flex text-[30px] font-semibold">
            <p className="text-[#FFFFFF] ml-[2px]">Last Name</p>
          </div>
          <div className="flex w-full justify-between">
            <input
              className="w-full h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]"
              placeholder="Last Name"
              value={inputState.lastName}
              onChange={handleChange("lastName")}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex text-[30px] font-semibold mt-[60px]">
          <p className="text-[#FFFFFF] ml-[2px]">Email</p>
        </div>
        <div className="flex w-full justify-between">
          <input
            className="w-full h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]"
            placeholder="Email"
            value={inputState.email}
            onChange={handleChange("email")}
          />
        </div>
      </div>
      <div>
        <div className="flex text-[30px] font-semibold mt-[30px]">
          <p className="text-[#FFFFFF] ml-[2px]">Phone Number</p>
        </div>
        <div className="flex w-full justify-between">
          <input
            className="w-full h-[95px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] text-[25px]"
            placeholder="Phone Number"
            value={inputState.phoneNumber}
            onChange={handleChange("phoneNumber")}
          />
        </div>
      </div>
      <div>
        <div className="flex text-[30px] font-semibold mt-[60px]">
          <p className="text-[#FFFFFF] ml-[2px]">Message</p>
        </div>
        <div className="flex w-full justify-between">
          <input
            className="w-full h-[285px] rounded-[10px] placeholder-[#0F0F0F] placeholder-opacity-50 pl-[15px] pb-[220px] text-[25px]"
            placeholder="Message"
            value={inputState.message}
            onChange={handleChange("message")}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
