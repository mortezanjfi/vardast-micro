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
    <div className="flex flex-1 flex-col md:pb">
      {isMobileView ? MobileHeader : DesktopHeader}
      {Content}
    </div>
  )
}

export default DesktopMobileViewOrganizer
