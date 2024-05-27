type IStepper = {
  name: string
  Icon: any
  currentStep: number
}[]

const Stepper = ({ steps, step }: { steps: IStepper; step: number }) => {
  return (
    <ol className="flex w-full items-center">
      {steps.map(({ currentStep, Icon, name }) => (
        <li
          key={currentStep}
          className={`flex items-center 
        ${
          currentStep === 0
            ? `text-primary `
            : `w-full ${
                step >= currentStep
                  ? "text-primary before:bg-primary"
                  : "text-alpha-300 before:bg-alpha-300"
              }  before:h-0.5 before:w-full before:rounded-2xl before:content-['']`
        }
              
            `}
        >
          <div className="gap-y-base py-base flex flex-col items-center justify-center text-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full p`}
            >
              <Icon />
            </div>
            <p className="whitespace-nowrap px text-sm">{name}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default Stepper
