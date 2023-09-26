import React from 'react';

function LoadingBar(props) {
    const {progress, className} = props;
    return (
        <div className={"h-2 w-full border-black bg-gray-200"}>
            <div className={`h-full ${className} bg-slate-800 transition-all`} style={{width: `${progress}%`}}>
            </div>
        </div>
    );
}

export default LoadingBar;