import React from "react";

const SubscribeCard = ({hello}) => {
  return (
    <div className="bg-slate-700 h-full flex items-center justify-center hover">
    <div className="bg-slate-900  flex flex-col md:flex-row rounded-l-xl p-2 mx-6 ">

       <img src={process.env.PUBLIC_URL + '/images/image.jpg'} className="h-80 md:h-64 rounded-l-xl md:rounded-r-none 
       transform hover:scale-105 hover:rounded-xl duration-200"/>
       <div className="p-6  md:p-12">
        <h2 className="font-serif text-xl font-medium text-center text-white md:text-left">
         Get diet and Fitness tips in your inbox{hello}
        </h2>

        <p className="max-w-xs my-4 text-xs leading-5 tracking-wide text-center text-white md:text-left">
            Eat better and Exercise better. Sign up for the Diet& Fitness newsletter.
        </p>
       <input type="text" className='p-2 px-4 bg-zinc-800 border border-zinc-600 w-full placeholder:text-center placeholder:text-xl focus:outline-none text-white text-center' placeholder="Enter your email"/>
       </div>
    </div>
    </div>
  );
};

export default SubscribeCard;
