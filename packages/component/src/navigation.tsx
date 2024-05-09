import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { useQuery } from "@tanstack/react-query"
import { GetVocabularyQuery } from "@vardast/graphql/generated"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getVocabularyQueryFn } from "@vardast/query/queryFns/vocabularyQueryFns"
import { LucideChevronDown } from "lucide-react"

// const nav = [
//   { title: "مصالح ساختمای" },
//   { title: "تاسیسات" },
//   { title: "ابزار و یراق" },
//   { title: "درب و پنجره" },
//   { title: "آهن آلات" }
// ]
const Navigation = () => {
  const { data } = useQuery<GetVocabularyQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
      { slug: "product_categories" }
    ],
    queryFn: () => getVocabularyQueryFn("product_categories")
  })

  if (!data) return <></>

  return (
    <NavigationMenu.Root className="relative z-[1] flex w-screen justify-center">
      <NavigationMenu.List className="center flex bg-white">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="text-violet11 hover:bg-violet3 focus:shadow-violet7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
            Learn{" "}
            <LucideChevronDown
              className="text-violet10 relative top-[1px] transition-transform duration-300 ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute left-0 top-0 w-full sm:w-auto">
            <ul className="one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
              <li className="row-span-3 grid">
                <NavigationMenu.Link asChild>
                  <a
                    className="focus:shadow-violet7 from-purple9 to-indigo9 flex
                  h-full w-full select-none flex-col justify-end rounded-[6px] bg-gradient-to-b p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px]"
                    href="/"
                  >
                    <svg
                      aria-hidden
                      width="38"
                      height="38"
                      viewBox="0 0 25 25"
                      fill="white"
                    >
                      <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
                      <path d="M12 0H4V8H12V0Z"></path>
                      <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
                    </svg>
                    <div className="mb-[7px] mt-4 text-[18px] font-medium leading-[1.2] text-white">
                      Radix Primitives
                    </div>
                    <p className="text-mauve4 text-[14px] leading-[1.3]">
                      Unstyled, accessible components for React.
                    </p>
                  </a>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="text-violet11 hover:bg-violet3 focus:shadow-violet7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
            Overview{" "}
            <LucideChevronDown
              className="text-violet10 relative top-[1px] transition-transform duration-300 ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-full sm:w-auto">
            <ul className="m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3"></ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="text-violet11 hover:bg-violet3 focus:shadow-violet7 block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
            href="https://github.com/radix-ui"
          >
            Github
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-white" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="perspective-[2000px] absolute left-0 top-full flex w-full justify-center">
        <NavigationMenu.Viewport className="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-white transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
      </div>
    </NavigationMenu.Root>
    // {data.vocabulary.categories.map(
    //     (category) =>
    //       category && (
    //         <NavigationMenuItem key={category.id}>
    //           <NavigationMenuTrigger className="px-2 py-1 text-sm leading-none">
    //             {category.title}
    //           </NavigationMenuTrigger>
    //           <NavigationMenuContent className="w-full">
    //             <div className="w-[var(--radix-navigation-menu-viewport-width)]">
    //               <NavigationMenuLink>Link</NavigationMenuLink>
    //             </div>
    //           </NavigationMenuContent>
    //         </NavigationMenuItem>
    //       )
    //   )}
  )
}

export default Navigation
