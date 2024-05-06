interface IDesktopMobileViewOrganizer {
  isMobileView: boolean
  DesktopSidebar?: JSX.Element
  MobileHeader?: JSX.Element
  DesktopHeader?: JSX.Element
  Content: JSX.Element
}

const DesktopMobileViewOrganizer: React.FC<IDesktopMobileViewOrganizer> = ({
  isMobileView,
  DesktopSidebar,
  MobileHeader,
  DesktopHeader,
  Content
}) => {
  return (
    <div className="flex flex-col md:flex-row md:gap-5 md:pb-9">
      {!isMobileView && DesktopSidebar}
      <div className="flex flex-1 flex-col">
        {isMobileView ? MobileHeader : DesktopHeader}
        {Content}
      </div>
    </div>
  )
}

export default DesktopMobileViewOrganizer
