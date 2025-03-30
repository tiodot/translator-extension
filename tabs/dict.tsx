import { useState } from "react"

function IndexDict() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension! Dict
      </h2>
      
    </div>
  )
}

export default IndexDict