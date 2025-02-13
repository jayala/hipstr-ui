import { Button, Checkbox, Divider, Heading, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FileParameter } from "src/components/FileParameter";
import { parameters } from "src/constants/parameters";
import { fastaAtom, paramsAtom } from "src/jotai/execute";

export const ParametersTab: FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const toast = useToast();
  const [fasta, setFasta] = useAtom(fastaAtom);
  const [params, setParams] = useAtom(paramsAtom);
  const { t } = useTranslation();

  const validParameters = !!fasta;
  return (
    <VStack gap="6" alignItems="flex-start" pb="4">
      <FileParameter
        label={t("referenceGenomeFasta")}
        value={fasta}
        onChange={(path) => {
          if (!/\.fasta|\.fa$/i.test(path)) {
            toast({
              title: t("fileDoesntHaveFastaExtension"),
              status: "error",
            });
            return;
          }
          setFasta(path);
        }}
      />

      <Heading as="h3" size="sm">
        {t("additionalParameters")}
      </Heading>

      {parameters.map((param) => (
        <VStack key={param.name} gap="2" alignItems="flex-start">
          {param.type === "boolean" ? (
            <Checkbox
              isChecked={params[param.name]}
              onChange={(e) => {
                if (e.target.checked) {
                  setParams({
                    ...params,
                    [param.name]: true,
                  });
                } else if (params[param.name]) {
                  const newParams = Object.fromEntries(Object.entries(params).filter(([key]) => key !== param.name));
                  setParams(newParams);
                }
              }}
            >
              <Text as="span" fontSize="sm" fontWeight="600">
                {param.name}:
              </Text>{" "}
              <Text as="span" fontSize="sm" fontWeight="400">
                {t(`${toCamelCase(param.name)}Description`)}
              </Text>
            </Checkbox>
          ) : (
            <>
              <Heading as="h4" size="xs">
                {param.name}:{" "}
                <Text as="span" fontSize="sm" fontWeight="400">
                  {t(`${toCamelCase(param.name)}Description`)}
                </Text>
              </Heading>
              <Input
                type={param.type}
                placeholder={t("value")}
                size="sm"
                value={params[param.name]}
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    setParams({
                      ...params,
                      [param.name]: e.target.value,
                    });
                  } else if (params[param.name]) {
                    const newParams = Object.fromEntries(Object.entries(params).filter(([key]) => key !== param.name));
                    setParams(newParams);
                  }
                }}
              />
            </>
          )}
        </VStack>
      ))}

      <Divider mt="4" />
      <Button
        size="sm"
        isDisabled={!validParameters}
        onClick={async () => {
          onFinish();
        }}
      >
        {t("continue")}
      </Button>
    </VStack>
  );
};

function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
