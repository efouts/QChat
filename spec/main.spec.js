describe('Formatting functions', function() {
  it('Should format time in 12 hour format (pm).', function() {
    var formattedDate = format12HourTime(new Date(11, 12, 6, 18, 30, 0));
    expect(formattedDate).toEqual('6:30:00 PM');
  });
  it('Should format time in 12 hour format (am).', function() {
    var formattedDate = format12HourTime(new Date(11, 12, 6, 6, 30, 0));
    expect(formattedDate).toEqual('6:30:00 AM');
  });
  it('Should format midnight as 12:00:00 AM.', function() {
    var formattedDate = format12HourTime(new Date(11, 12, 6, 0, 30, 0));
    expect(formattedDate).toEqual('12:30:00 AM');
  });
});