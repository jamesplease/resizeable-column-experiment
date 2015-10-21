import resizeableColumn from '../../src/resizeable-column';

describe('resizeableColumn', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(resizeableColumn, 'greet');
      resizeableColumn.greet();
    });

    it('should have been run once', () => {
      expect(resizeableColumn.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(resizeableColumn.greet).to.have.always.returned('hello');
    });
  });
});
