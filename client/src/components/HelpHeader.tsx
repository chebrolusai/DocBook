import { useTranslation } from "react-i18next";
import DocBookHeader from "./DocBookHeader";

function HelpHeader() {
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });

  return (
    <div
      style={{ backgroundColor: "#f8fcfd", minHeight: "60vh", width: "100%" }}
    >
      <DocBookHeader></DocBookHeader>
      <div className="container">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "calc(60vh - 60px)" }}
        >
          <div className="col-12 text-center">
            <h2 className="display-3">{t("help.page.text1")}</h2>
            <p className="lead mt-3">{t("help.page.text2")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpHeader;
