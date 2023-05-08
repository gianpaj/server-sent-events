import { useRef, useState } from "react";
import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source";

// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [buttonText, setButtonText] = useState("Click me");
  const [generatedDescs, setGeneratedDescs] = useState("");
  const ctrl = useRef<AbortController>();

  async function startStream() {
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    setGeneratedDescs("");
    const decoder = new TextDecoder();

    await fetchEventSource("https://localhost:5050/api/stream", {
      signal: ctrl.current.signal,
      async onopen(response) {
        if (response.ok && response.headers.get("content-type")?.startsWith(EventStreamContentType)) {
          setButtonText("Cancel");
          return; // everything's good
        }
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          console.log(response);
          // client-side errors are usually non-retriable:
          throw new Error();
        } else {
          console.log(response);
          console.log(EventStreamContentType);
          console.log(response.headers.get("content-type"));
          // TODO: retry
          throw new Error();
        }
      },
      onmessage(msg) {
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:
        if (msg.event === "FatalError") {
          throw new Error(msg.data);
        }
        console.log(msg);

        setGeneratedDescs((prev) => prev + msg.data);

        // FIXME: decode strings
        // const chunkValue = decoder.decode(msg.data);
        // setGeneratedDescs((prev) => prev + chunkValue);
      },
      onclose() {
        // if the server closes the connection unexpectedly
        // ctrl.current.cancel();
        setButtonText("Click me");
      },
      onerror(err) {
        setButtonText("Click me");
        if (err instanceof Error) {
          throw err; // rethrow to stop the operation
        } else {
          // do nothing to automatically retry. You can also
          // return a specific retry interval here.
        }
      },
    });
  }

  async function onClick() {
    if (buttonText === "Click me") {
      await startStream();
    } else {
      console.log("cancel");
      ctrl.current?.abort();
      setButtonText("Click me");
    }
  }

  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <h1>Server-sent events</h1>
      <div className="card">
        <button onClick={onClick}>{buttonText}</button>
        <div className="text">
          <p>{generatedDescs}</p>
        </div>
      </div>
    </>
  );
}

export default App;
