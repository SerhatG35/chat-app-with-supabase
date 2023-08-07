import { inputAnatomy } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const Heading = defineStyleConfig({
  baseStyle: {
    color: "purple.400",
  },
});
const Text = defineStyleConfig({
  baseStyle: {
    color: "purple.400",
  },
});
const Button = defineStyleConfig({
  defaultProps: {
    colorScheme: "purple",
  },
});
const FormLabel = defineStyleConfig({
  baseStyle: {
    color: "purple.400",
  },
});

const InputStyle = definePartsStyle({
  field: {
    borderColor: "purple.400",
    color: "purple.400",
    _focus: {
      _focusVisible: {
        boxShadow: "0 0 0 1px #9f7aea",
        borderColor: "purple.400",
      },
    },
  },
});
export const Input = defineMultiStyleConfig({ baseStyle: InputStyle });

export const theme = extendTheme({
  components: {
    Heading,
    Text,
    Button,
    Input,
    FormLabel,
  },
});
