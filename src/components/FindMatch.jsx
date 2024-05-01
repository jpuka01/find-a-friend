import React from "react";
import loader from "../assets/loader.gif";
import classNames from "./FindMatch.module.css";

function FindMatch({ error, onClose: handleClose }) {
  return (
    <div className={classNames["find-match-root"]}>
      <div className={classNames["find-match-container"]}>
        {error ? (
          <>
            <h1 className={classNames["find-match-title"]}>
              Failed to Find Match
            </h1>
            <p className={classNames["find-match-text"]}>
              Our servers are currently experiencing issues. Please try again at
              a later time.
            </p>
            <button
              className={classNames["find-match-button"]}
              onClick={handleClose}
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <h1 className={classNames["find-match-title"]}>Finding Match...</h1>
            <img src={loader} alt="loader" />
          </>
        )}
      </div>
    </div>
  );
}

export default FindMatch;
