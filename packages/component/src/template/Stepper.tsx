"use client"

import { Step } from "@/template/OfferItemStepper"
import { clsx } from "clsx"

import DynamicIcon from "../DynamicIcon"

const Stepper = ({ steps, step }: { steps: Step[]; step: number }) => {
  return (
    <div className="flex flex-col gap-9 border-b pb-4">
      <ol className="flex w-full items-center">
        {steps.map(({ currentStep, Icon, name }) => (
          <li
            key={currentStep}
            className={clsx(
              "flex items-center",
              currentStep === 0 && "text-primary",
              currentStep !== 0 &&
                "w-full before:h-0.5 before:w-full before:rounded-2xl before:content-['']",
              step >= currentStep
                ? "text-primary before:bg-primary"
                : "text-alpha-300 before:bg-alpha-300"
            )}
            //   className={`flex items-center
            // ${
            //   currentStep === 0
            //   ? `text-primary `
            //   : `w-full ${
            //     step >= currentStep
            //           ? "text-primary before:bg-primary"
            //           : "text-alpha-300 before:bg-alpha-300"
            //         }  before:h-0.5 before:w-full before:rounded-2xl before:content-['']`}`}
          >
            <div className="gap-y-base py-base flex flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full p">
                <DynamicIcon
                  name={Icon}
                  className={clsx("icon")}
                  strokeWidth={1.5}
                />
              </div>
              <p className="whitespace-nowrap px text-sm">{name}</p>
            </div>
          </li>
        ))}
      </ol>
      {steps.find((item) => item.currentStep === step)?.description && (
        <p className="text-sm text-alpha-500">
          - {steps.find((item) => item.currentStep === step)?.description}
        </p>
      )}
    </div>
  )
}

export default Stepper
