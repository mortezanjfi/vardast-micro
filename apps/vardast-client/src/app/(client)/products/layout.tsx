import WithLayoutMaker from "@vardast/component/hoc/WithLayoutMaker"
import layout_options from "@vardast/lib/layout_options"

export default WithLayoutMaker({
  options: layout_options.createOptionByMobileTitle(
    {
      type: "text",
      value: "محصولات"
    },
    "_products"
  )
})
