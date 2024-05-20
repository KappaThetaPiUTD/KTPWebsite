import { CiLinkedin, CiInstagram, CiLink } from "react-icons/ci";
import MailIcon from "./mail-icon-footer";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.leftSection}>
        <div style={styles.icons}>
          <MailIcon />
          <a href="https://www.linkedin.com/company/ktputd" target="_blank">
            <CiLinkedin
              style={{ ...styles.icon, marginLeft: "20px", marginRight: "2px" }}
              size={50}
            />
          </a>
          <a href="https://www.instagram.com/utdktp/" target="_blank">
            <CiInstagram
              style={{ ...styles.icon, marginLeft: "20px", marginRight: "2px" }}
              size={50}
            />
          </a>
        </div>
      </div>
      <div style={styles.rightSection}>
        <div style={styles.title}>Kappa Theta Pi - Mu Chapter</div>
        <div style={styles.subtitle}>Managed by Membership Committee</div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "black",
    color: "darkgray",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 0,
    width: "100%",
    zIndex: 1000,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    width: "auto",
  },
  icons: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: "2px",
  },
  rightSection: {
    textAlign: "right",
  },
  title: {
    fontSize: "25px",
    fontWeight: "200",
    marginBottom: "1px",
    fontFamily: "Poppins",
  },
  subtitle: {
    fontSize: "0.8rem",
    fontWeight: "200",
    marginBottom: "1px",
    fontFamily: "Poppins",
  },
};

export default Footer;
