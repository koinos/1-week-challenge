import { Flex, Heading } from "@chakra-ui/react";
import SitePreferences from "./SitePreferences";
import {
  KoinosAccountConnector,
  // @ts-ignore
} from "react-koinos-toolkit";

export default function Header() {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"space-between"}
      flexShrink="0"
      gap="4"
    >
      <Heading>Fact or Fiction?</Heading>
      <KoinosAccountConnector sitePreferences={<SitePreferences />} />
    </Flex>
  );
}
