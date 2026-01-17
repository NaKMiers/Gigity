// To install: npm i @tavily/core
const { tavily } = require('@tavily/core');
const client = tavily({ apiKey: "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" });
client.search("Tìm thông tin chi tiết và cập nhật về Công ty cổ phần Vinamilk tại Việt Nam: lịch sử hình thành và phát triển, cơ cấu sở hữu, danh mục sản phẩm chính, quy mô doanh thu và lợi nhuận, thị phần trong ngành sữa, hệ thống phân phối, chiến lược kinh doanh và marketing, các thị trường xuất khẩu, đối thủ cạnh tranh chính và vị thế của Vinamilk trên thị trường sữa Việt Nam", {
    searchDepth: "advanced"
})
.then(console.log);