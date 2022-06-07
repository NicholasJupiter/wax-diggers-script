type WaxConfig = {
  repirType: 0 | 1, // 0 耐久度0维修, 1,每次执行前维修
}

// data
type Data = {
  [key as string] : Row[], // 
};
// row
type Row = {
  asset_id: string;
  account: string;
  // ....
}