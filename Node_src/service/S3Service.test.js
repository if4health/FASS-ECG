const s3Service = require('./S3Service');


test('should create file on uploads dir', async () => {
    await s3Service.upload("teste.txt","AAAAAAAAAAAAAAAAAAAA");
    // expect(sum(1, 2)).toBe(3);
});