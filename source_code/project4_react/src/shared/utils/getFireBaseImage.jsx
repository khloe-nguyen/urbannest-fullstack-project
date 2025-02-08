const getFirebaseImageUrl = (fileName) => {
  const url = `https://firebasestorage.googleapis.com/v0/b/techwizwebapp.appspot.com/o/Images%2F${fileName}?alt=media&token=96ce3d26-1f12-40cf-a9d0-e355b0f238f7`;
  return url;
};

export default getFirebaseImageUrl;
