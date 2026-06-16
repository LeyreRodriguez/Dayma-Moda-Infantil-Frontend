
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans dark:bg-dark-bg dark:text-dark-text">
      <div className="max-w-[1126px] mx-auto border-x border-border dark:border-dark-border min-h-screen flex flex-col text-center">

        <h1 className="text-[56px] tracking-tight text-text-heading dark:text-dark-heading my-8">
          Hola mundo
        </h1>

        <h2 className=" dark:text-dark-heading">
          Subtítulo
        </h2>

        <p className="m-0">
          Texto normal
        </p>

        <code className="bg-code dark:bg-dark-code px-2 py-1 rounded text-text-heading font-mono">
          console.log("hola")
        </code>

      </div>
    </div>
  )
}