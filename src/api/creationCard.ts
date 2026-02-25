import instance from "@/api/instance";

export const creationCard = async (data: FormData) => {
  await instance("api/v1/posts/", {
    method: "post",
    data,
  }).catch((e) => {
    // eslint-disable-next-line
    console.log(e);
  });
};
