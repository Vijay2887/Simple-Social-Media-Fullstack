import { useState } from "react";

const CommentComponent = (props) => {
  const { c, msg } = props;

  return (
    <>
      {msg ? (
        <div className="text-sm">{msg}</div>
      ) : (
        <div>
          <div className="text-[12px] font-semibold flex items-center gap-2">
            {/* This div contains username of each comment */}
            <div className="w-[15px] h-[15px] rounded-full bg-purple-700"></div>
            <div>{c["commented By"]}</div>
          </div>
          <div className="text-sm">
            {/* This div contains actal comment message */}
            {c.comment}
          </div>
        </div>
      )}
    </>
  );
};

export default CommentComponent;
