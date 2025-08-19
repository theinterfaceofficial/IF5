import { GlobalConfig } from "../GlobalConfig";

export default function NotFound() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Not Found`;

  return (
    <div>
      <title>{title}</title>
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
