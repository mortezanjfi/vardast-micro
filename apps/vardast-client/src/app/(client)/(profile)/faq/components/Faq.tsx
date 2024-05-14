"use client"

import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQuery } from "@tanstack/react-query"
import FilterBlock from "@vardast/component/filter-block"
import { GetAllFaqQuery } from "@vardast/graphql/generated"
import { getAllFaqQueryFns } from "@vardast/query/queryFns/getAllFaqQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"

const Faq = ({ isMobileView }: { isMobileView?: boolean }) => {
  const faqs = useQuery<GetAllFaqQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.GET_ALL_FAQ],
    queryFn: getAllFaqQueryFns
  })
  return (
    <div className="flex flex-col rounded-3xl bg-alpha-white px md:p-11 md:pt-0">
      {!isMobileView && (
        <div className="flex items-center gap-x-4 py">
          <QuestionMarkCircleIcon className="h-10 w-10 text-primary" />
          <h2 className="font-bold">پرسش های متداول</h2>
        </div>
      )}
      <div className="flex flex-col gap-y divide-y-0.5">
        {faqs.data?.faqs.map(({ answer, id, question }, index) => (
          <FilterBlock
            key={id}
            title={`${digitsEnToFa(index + 1)} - ${question}`}
          >
            {answer}
          </FilterBlock>
        ))}
      </div>
    </div>
  )
}

export default Faq
